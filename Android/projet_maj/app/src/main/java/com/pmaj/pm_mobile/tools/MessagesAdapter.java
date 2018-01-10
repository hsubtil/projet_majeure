package com.pmaj.pm_mobile.tools;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.support.v7.widget.RecyclerView;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.activities.LoginActivity;
import com.pmaj.pm_mobile.model.Message;

import java.util.List;



public class MessagesAdapter extends RecyclerView.Adapter<MessagesAdapter.ViewHolder> {

    private List<Message> dataset;
    private Context ActivityContext;
    private static SharedPreferences mPrefs;


    // Provide a reference to the views for each data item
    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView sender;
        public TextView messageText;
        public LinearLayout message;

        public ViewHolder(View v) {
            super(v);

            sender = v.findViewById(R.id.sender);
            messageText = v.findViewById(R.id.messageText);
            message = v.findViewById(R.id.message);
        }
    }

    // Provide a suitable constructor (depends on the kind of dataset)
    public MessagesAdapter(List<Message> dataset, Context ActivityContext) {

        mPrefs = ActivityContext.getSharedPreferences("authToken", 0);
        this.dataset = dataset;
        this.ActivityContext = ActivityContext;
    }

    // Create new views (invoked by the layout manager)
    @Override
    public MessagesAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // create a new view
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.message, parent, false);
        return new ViewHolder(v);
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final ViewHolder holder, int position) {
        // - get element from your dataset at this position
        // - replace the contents of the view with that element
        //mPrefs = ActivityContext.getSharedPreferences("name", 0);

        holder.sender.setText(dataset.get(position).getSender());
        holder.messageText.setText(dataset.get(position).getMessageText());

        //String m = mPrefs.getString("name","");
        String m = mPrefs.getString("name","");
        String p = dataset.get(position).getSender();
        if(m.equals(p)){
            holder.message.setBackgroundColor(Color.parseColor("#b9e7c4"));
            holder.sender.setGravity(Gravity.RIGHT);
            holder.messageText.setGravity(Gravity.RIGHT);

        }
        else
        {
            holder.message.setBackgroundColor(Color.parseColor("#f9f1c7"));
            holder.sender.setGravity(Gravity.LEFT);
            holder.messageText.setGravity(Gravity.LEFT);
        }



    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return dataset.size();
    }




}